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

  ctx.translate(WIDTH, 0); // move origin to top-right
  ctx.rotate(Math.PI / 2); // rotate canvas
  ctx.drawImage(img, 0, 0, HEIGHT, WIDTH);

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

export function base64StringToImageUrl(base64Str) {
  if (!base64Str) return;
  const WIDTH = 96;
  const HEIGHT = 184;

  const binaryStr = atob(base64Str);
  const byteArr = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    byteArr[i] = binaryStr.charCodeAt(i);
  }

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(WIDTH, HEIGHT);
  const data = imageData.data;

  let byteIdx = 0;
  for (let y = 0; y < HEIGHT; y++) {
    for (let xByte = 0; xByte < WIDTH / 8; xByte++) {
      const byte = byteArr[byteIdx++];
      for (let bit = 7; bit >= 0; bit--) {
        const bitVal = (byte >> bit) & 1;
        const pixelIndex = (y * WIDTH + xByte * 8 + (7 - bit)) * 4;
        const color = bitVal ? 255 : 0;
        data[pixelIndex] = color; // R
        data[pixelIndex + 1] = color; // G
        data[pixelIndex + 2] = color; // B
        data[pixelIndex + 3] = 255; // A
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const rotatedCanvas = document.createElement("canvas");
  rotatedCanvas.width = HEIGHT; // becomes width = 184
  rotatedCanvas.height = WIDTH; // becomes height = 96
  const rCtx = rotatedCanvas.getContext("2d");

  // Rotate 270° (counter-clockwise) and draw
  rCtx.translate(0, WIDTH);
  rCtx.rotate(-Math.PI / 2);
  rCtx.drawImage(canvas, 0, 0);

  return rotatedCanvas.toDataURL("image/png"); // <- this is your final image URL
}
