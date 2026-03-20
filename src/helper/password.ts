import bcrypt from "bcrypt";

export const comparePassword = async (
  input: string,
  stored: string
): Promise<boolean> => {
  if (!input || !stored) return false;

  try {
    return await bcrypt.compare(input, stored);
  } catch {
    return false;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};


