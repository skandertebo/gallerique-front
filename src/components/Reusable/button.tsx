import tw from "tailwind-styled-components";
import { clsxm } from "../../utils/clsxm";

export type ButtonVariant = "primary" | "secondary" | "tertiary";

const Button = tw.button<{ $variant?: ButtonVariant; $color?: string }>`

  ${({ $variant, $color = "palette-6" }) => {
    switch ($variant) {
      case "primary":
        return clsxm(`bg-${$color} text-white border border-${$color}`);
      case "secondary":
        return clsxm(`border border-${$color} text-${$color}`);
      default:
        return `bg-palette-1 text-white`;
    }
  }}
  w-full text-center flex justify-center
  px-4 py-2 rounded-md
`;

export default Button;
