const [users, setUsers] = useState([]);

useEffect(() => {
  database().setPersistenceEnabled(true);

  const onValueChange = database()
    .ref('/users')
    .on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setUsers(usersList);
      } else {
        setUsers([]);
      }
    });

  return () => database().ref('/users').off('value', onValueChange);
}, []);
