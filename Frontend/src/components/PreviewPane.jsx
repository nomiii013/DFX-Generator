import React, { useEffect, useState } from "react";

const PreviewPane = ({ text, layout, font, template, height }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if no text, clear preview
    if (!text || !text.trim()) {
      setPreviewUrl(null);
      return;
    }

    const fetchPreview = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:5000/api/dxf/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            layout,
            font,
            template,
            height,
            scale: 1.0,
            watermark: false,
          }),
        });

        if (!response.ok) {
          console.error("Preview error:", await response.text());
          setPreviewUrl(null);
          return;
        }

        // Convert response to blob → object URL
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      } catch (err) {
        console.error("Preview fetch failed:", err);
        setPreviewUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();

    // cleanup old blob URL
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [text, layout, font, template, height]);

  return (
    <div className="mb-8 p-4 border border-gray-700 rounded-lg bg-gray-800/60 text-center">
      <p className="text-gray-400 mb-2 text-sm">DXF Preview:</p>
      {loading && <p className="text-gray-500">⏳ Generating preview...</p>}
      {!loading && previewUrl && (
        <img
          src={previewUrl}
          alt="DXF Preview"
          className="mx-auto max-h-64 rounded-lg shadow-lg border border-gray-600"
        />
      )}
      {!loading && !previewUrl && (
        <p className="text-gray-600 text-sm">Enter text to see preview</p>
      )}
    </div>
  );
};

export default PreviewPane;
