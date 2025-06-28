export async function imageToBase64String(source) {
  const WIDTH = 96;
  const HEIGHT = 184;

  const img = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;

    if (typeof source === "string") {
      el.crossOrigin = "anonymous";
      el.src = source;
    } else {
      el.src = URL.createObjectURL(source);
    }
  });

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);

  const { data } = ctx.getImageData(0, 0, WIDTH, HEIGHT);
  const mono = new Uint8Array(WIDTH * HEIGHT);
  const threshold = 128;

  for (let i = 0, px = 0; i < data.length; i += 4, px++) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    mono[px] = lum < threshold ? 0 : 1;
  }

  const byteArr = [];
  for (let y = 0; y < HEIGHT; y++) {
    let byte = 0;
    let bits = 0;

    for (let x = 0; x < WIDTH; x++) {
      byte = (byte << 1) | mono[y * WIDTH + x];
      if (++bits === 8) {
        byteArr.push(byte);
        byte = bits = 0;
      }
    }

    if (bits) {
      byte <<= 8 - bits;
      byteArr.push(byte);
    }
  }

  const raw = String.fromCharCode(...byteArr);
  return btoa(raw);
}
