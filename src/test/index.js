const [users, setUsers] = useState([]);

useEffect(()=>{
    // Enable offline persistence
    database().setPersistenceEnabled(true);

    const onValueChange = database()
      .ref('/users')
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          const usersList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setUsers(usersList);
          console.log(users);
        } else {
          setUsers([]);
        }
      });

    return () => database().ref('/users').off('value', onValueChange);

},[])

// {
//   "cli": {
//     "version": ">= 10.0.3"
//   },
//   "build": {
//     "development": {
//       "developmentClient": true,
//       "distribution": "internal"
//     },
//     "preview": {
//       "distribution": "internal"
//     },
//     "production": {}
//   },
//   "submit": {
//     "production": {}
//   }
// }
  //  "splash": {
  //     "image": "./src/assets/images/notedly.png",
  //     "resizeMode": "contain",
  //     "backgroundColor": "#ffffff"
      
  //   },