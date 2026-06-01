export async function discoverUsbPrinter() {
  if (typeof navigator === "undefined" || !navigator.usb) {
    return { ok: false, type: "unsupported", message: "Bu tarayıcı WebUSB desteklemiyor. Chrome veya Edge kullanın." };
  }
  try {
    const device = await navigator.usb.requestDevice({ filters: [] });
    return { ok: true, type: "usb", device: { productName: device.productName, manufacturerName: device.manufacturerName, vendorId: device.vendorId, productId: device.productId } };
  } catch (error) {
    return { ok: false, type: "usb", message: error?.message || "USB cihaz seçilemedi." };
  }
}
export async function discoverSerialPrinter() {
  if (typeof navigator === "undefined" || !navigator.serial) {
    return { ok: false, type: "unsupported", message: "Bu tarayıcı WebSerial desteklemiyor. Chrome veya Edge kullanın." };
  }
  try {
    const port = await navigator.serial.requestPort();
    const info = port.getInfo();
    return { ok: true, type: "serial", device: info };
  } catch (error) {
    return { ok: false, type: "serial", message: error?.message || "Serial cihaz seçilemedi." };
  }
}
