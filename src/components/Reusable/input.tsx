import tw from "tailwind-styled-components";

const Input = tw.input`
  border
  rounded-xl
  border-palette-2
  hover:border-palette-1
  focus:border-palette-1
  focus:outline-none
  transition-colors
  px-4
  py-2
  my-2
`;

export default Input;
