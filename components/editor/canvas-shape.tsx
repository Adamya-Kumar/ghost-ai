import type { CanvasShape } from "@/types/canvas"

const STROKE = "var(--muted-foreground)"

function shapePath(shape: CanvasShape, w: number, h: number) {
  const inset = 1.5

  switch (shape) {
    case "rectangle":
      return `M ${inset} ${inset} H ${w - inset} V ${h - inset} H ${inset} Z`
    case "circle":
      return null
    case "pill": {
      const r = Math.max((h - inset * 2) / 2, 0)
      return roundedRectPath(inset, inset, w - inset * 2, h - inset * 2, r)
    }
    case "diamond":
      return `M ${w / 2} ${inset} L ${w - inset} ${h / 2} L ${w / 2} ${h - inset} L ${inset} ${h / 2} Z`
    case "hexagon": {
      const x = w * 0.22
      return `M ${x} ${inset} L ${w - x} ${inset} L ${w - inset} ${h / 2} L ${w - x} ${h - inset} L ${x} ${h - inset} L ${inset} ${h / 2} Z`
    }
    case "cylinder":
      return null
  }
}

function roundedRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2)
  return [
    `M ${x + r} ${y}`,
    `H ${x + width - r}`,
    `A ${r} ${r} 0 0 1 ${x + width} ${y + r}`,
    `V ${y + height - r}`,
    `A ${r} ${r} 0 0 1 ${x + width - r} ${y + height}`,
    `H ${x + r}`,
    `A ${r} ${r} 0 0 1 ${x} ${y + height - r}`,
    `V ${y + r}`,
    `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
    "Z",
  ].join(" ")
}

type CanvasShapeGraphicProps = {
  shape: CanvasShape
  color: string
  width: number
  height: number
}

export function CanvasShapeGraphic({
  shape,
  color,
  width,
  height,
}: CanvasShapeGraphicProps) {
  const w = Math.max(width, 1)
  const h = Math.max(height, 1)
  const inset = 1.5

  return (
    <svg
      className="absolute inset-0 h-full w-full overflow-visible"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      {shape === "circle" ? (
        <ellipse
          cx={w / 2}
          cy={h / 2}
          rx={Math.max(w / 2 - inset, 0)}
          ry={Math.max(h / 2 - inset, 0)}
          fill={color}
          stroke={STROKE}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      ) : shape === "cylinder" ? (
        <CylinderGraphic width={w} height={h} color={color} />
      ) : (
        <path
          d={shapePath(shape, w, h) ?? ""}
          fill={color}
          stroke={STROKE}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  )
}

function CylinderGraphic({
  width: w,
  height: h,
  color,
}: {
  width: number
  height: number
  color: string
}) {
  const inset = 1.5
  const ry = Math.min(h * 0.18, 22)
  const rx = Math.max(w / 2 - inset, 0)
  const top = inset + ry

  return (
    <>
      <path
        d={[
          `M ${inset} ${top}`,
          `L ${inset} ${h - top}`,
          `A ${rx} ${ry} 0 0 0 ${w - inset} ${h - top}`,
          `L ${w - inset} ${top}`,
          `A ${rx} ${ry} 0 0 0 ${inset} ${top}`,
          "Z",
        ].join(" ")}
        fill={color}
        stroke={STROKE}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      />
      <ellipse
        cx={w / 2}
        cy={top}
        rx={rx}
        ry={ry}
        fill={color}
        stroke={STROKE}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      />
    </>
  )
}
