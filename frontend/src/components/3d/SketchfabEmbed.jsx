import { useTheme } from '../../context/ThemeContext';

export default function SketchfabEmbed() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const modelId = '0fc4b8409ff84a3e9814ba0f51407281';

  const params = new URLSearchParams({
    autostart: '1',
    autospin: '0.25',
    ui_infos: '0',
    ui_controls: '0',
    ui_stop: '0',
    ui_watermark: '0',
    ui_help: '0',
    ui_settings: '0',
    ui_vr: '0',
    ui_annotations: '0',
    ui_color: isDark ? '00dcff' : '6b21e8',
    ui_theme: 'dark',
    camera: '0',
  });

  const embedUrl = `https://sketchfab.com/models/${modelId}/embed?${params.toString()}`;

  return (
    <div className="sketchfab-wrapper">
      <iframe
        key={theme} /* re-mount khi đổi theme để cập nhật màu UI */
        title="PS5 DualSense Controller"
        src={embedUrl}
        frameBorder="0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        className="sketchfab-iframe"
      />
      {/* Overlay gradient để hoà tan 4 cạnh vào background */}
      <div className="sketchfab-vignette" />
    </div>
  );
}
