interface Props {
  children: React.ReactNode;
}

export const ErrorText = ({ children }: Props) => {
  return <p className="text-red-700">{children}</p>;
};
