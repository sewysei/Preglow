export const setCookie = async (req, res) => {
  res.cookie("token", "kudanil", {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
  });
  res.status(200).json({ message: "Cookie is made" });
};
