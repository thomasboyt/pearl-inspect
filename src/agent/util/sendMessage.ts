export default function sendMessage(name: string, data = {}) {
  window.postMessage(
    {
      source: 'coquette-inspect-agent',
      name: name,
      data: data,
    },
    '*'
  );
}
