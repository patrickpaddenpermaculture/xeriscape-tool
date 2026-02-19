import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const form = formidable({ multiples: false });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ ok: false, error: err.message });
    }

    const file = files.image;
    if (!file) {
      return res.status(400).json({
        ok: false,
        error: "No file uploaded. Field name must be 'image'.",
      });
    }

    return res.status(200).json({
      ok: true,
      filename: file.originalFilename,
      size: file.size,
      type: file.mimetype,
    });
  });
}
