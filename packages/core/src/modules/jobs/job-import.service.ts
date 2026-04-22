type ImportedJobFields = {
  title: string;
  company: string;
  role: string;
  status: "applied" | "interview" | "offer" | "rejected";
  content: string;
  tags: string[];
  source: string;
  link: string;
  appliedAt: string;
};

function isUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function htmlToText(html: string) {
  return decodeHtmlEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<\/(p|div|section|article|li|h1|h2|h3|h4|h5|h6|br)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim(),
  );
}

async function fetchJobPageText(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: new URL(url).origin,
    },
    cache: "no-store",
  });

  if (response.ok) {
    const html = await response.text();
    const text = htmlToText(html);
    return text.slice(0, 20000);
  }

  // Some job boards block direct server-side fetches with 403. In those cases
  // fall back to a readability proxy rather than failing the whole import flow.
  if (response.status === 403) {
    const proxyResponse = await fetch(
      `https://r.jina.ai/http://${url.replace(/^https?:\/\//, "")}`,
      {
        headers: {
          "User-Agent": "Personal-OS Job Importer",
        },
        cache: "no-store",
      },
    );

    if (proxyResponse.ok) {
      const proxiedText = await proxyResponse.text();
      return proxiedText.slice(0, 20000);
    }
  }

  throw new Error(`Failed to fetch job page: ${response.status}`);
}

function buildPrompt(sourceText: string, pageText?: string) {
  return [
    "Extract structured job application details from the provided source.",
    "Return only facts grounded in the source.",
    "If a field is unknown, return an empty string.",
    "Status must be one of: applied, interview, offer, rejected.",
    "Use offer for shortlisted/final-round/offer-like states when the posting itself implies a strong shortlist but no better match exists.",
    "For appliedAt, return YYYY-MM-DD if explicitly stated, otherwise an empty string.",
    "",
    `Source input:\n${sourceText}`,
    pageText ? `\nFetched page text:\n${pageText}` : "",
  ].join("\n");
}

export async function importJobDetails(
  sourceText: string,
): Promise<ImportedJobFields> {
  const apiKey = process.env.OPENAI_API_KEY;

  console.log({ apiKey });

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const trimmed = sourceText.trim();
  if (!trimmed) {
    throw new Error("Job link or description is required");
  }

  const pageText = isUrl(trimmed) ? await fetchJobPageText(trimmed) : undefined;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5.4-mini",
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "job_import",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              company: { type: "string" },
              role: { type: "string" },
              status: {
                type: "string",
                enum: ["applied", "interview", "offer", "rejected"],
              },
              content: { type: "string" },
              tags: {
                type: "array",
                items: { type: "string" },
              },
              source: { type: "string" },
              link: { type: "string" },
              appliedAt: { type: "string" },
            },
            required: [
              "title",
              "company",
              "role",
              "status",
              "content",
              "tags",
              "source",
              "link",
              "appliedAt",
            ],
          },
        },
      },
      messages: [
        {
          role: "system",
          content:
            "You extract job posting data into a strict schema for a job tracking app.",
        },
        {
          role: "user",
          content: buildPrompt(trimmed, pageText),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI did not return structured job details");
  }

  return JSON.parse(content) as ImportedJobFields;
}
