# Label Printing

## Overview

ReelManager includes a label printing studio for electronic component inventory labels.

## Supported Label Profiles

Examples:

```txt
Thermal 50 x 25 mm
Thermal 40 x 30 mm
Thermal 58 x 40 mm
Brother DK-11201 29 x 90 mm
DYMO 89 x 36 mm
Mini QR 30 x 20 mm
A4 Sheet 70 x 37 mm
```

## Printable Fields

Users can choose which fields appear on the label:

```txt
SKU
Part number
Value
Package
Stock quantity
Location
Manufacturer
QR code
```

## QR Content Options

```txt
SKU
Part number
Component detail URL
```

## Browser Print

For browser print:

- Disable headers/footers
- Use scale 100%
- Use correct paper size
- Use no margins when supported

## ZPL Support

For Zebra-compatible printers, ReelManager can generate ZPL output.

The user may copy ZPL and send it to the printer using vendor tools or raw print utilities.

## USB / Serial Printer Discovery

Browser security prevents silent USB/Serial device listing.

Supported APIs:

- WebUSB
- WebSerial

The user must explicitly select and authorize the device.

Fallback behavior:

- Browser print
- ZPL copy
- Manual printer selection
