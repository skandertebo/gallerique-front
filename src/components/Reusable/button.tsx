import tw from "tailwind-styled-components";
import { clsxm } from "../../utils/clsxm";

export type ButtonVariant = "primary" | "secondary" | "tertiary";

const Button = tw.button<{ $variant?: ButtonVariant; $color?: string }>`

  ${({ $variant, $color = "palette-6" }) => {
    let className: string;
    switch ($variant) {
      case "primary":
        className = clsxm(`bg-${$color} text-white border border-${$color}`);
        break;
      case "secondary":
        className = clsxm(`border border-${$color} text-${$color}`);
        break;
      default:
        className = `bg-palette-1 text-white`;
    }
    return className;
  }}
  w-full text-center flex justify-center
  px-4 py-2 rounded-md
`;

export default Button;
