export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { username, email , password } = req.body;
      const user = await User.findOne({ username });
      console.log(user);
      if (user) {
        return res.status(400).json({ error: "Username already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userBody = {
        username,
        email,
        password: hashedPassword,
      };
      const createUser = new User(userBody);
      if (createUser) {
        await createUser.save();
        const token = await generateTokenAndSetCookie(
          { id: createUser._id, username: createUser.username },
          res
        );

        res.status(201).json({
          _id: createUser._id,
          username: createUser.username,
        });
      }
    } catch (err) {
      return err;
    }


  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}