export default function handler(req, res) {
  res.clearPreviewData();
  res.setHeader("Cache-Control", "no-store");
  res.redirect(307, "/");
}
