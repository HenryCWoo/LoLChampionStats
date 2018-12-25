# League of Legends Champions Statistics

This project displays aggregated data from the popular game, League of Legends by Riot Games. Data such as the winrates, banrates, average playerbase KDA's and more are presented in an organized fashion. This project focused on providing a nice user interface and maintainable code for future extensions. Data is provided by Champion.gg API. This project is not currently hosted on a public server.

## Preview

![alt text](https://github.com/HenryCWoo/LeagueStats/blob/master/readme_image_resources/Loading.gif)


## Built With

* [MongoDB](https://www.mongodb.com/) - The database used to cache aggregated data
* [Redis](https://redis.io/) - Implemented with Redis Task Queue to cache data into MongoDB
* [Flask](http://flask.pocoo.org/) - RestAPI framework used to create an endpoint into MongoDB
* [ReactJS](https://reactjs.org/) - The web framework used
* [Material-UI](https://material-ui.com/) - Popular UI component library
* [Recharts](http://recharts.org/en-US/) - Charts component library used to display data
* [Riot Games API](https://developer.riotgames.com/) - Official Riot Games portal for retrieving static resources such as images

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

