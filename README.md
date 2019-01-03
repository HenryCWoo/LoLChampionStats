# League of Legends Champions Statistics

This project displays aggregated data from the popular game, League of Legends by Riot Games. Data such as the winrates, banrates, average playerbase KDA's and more are presented in an organized fashion. This project focused on providing a nice user interface and maintainable code for future extensions. Data is provided by Champion.gg API. This project is not currently hosted on a public server.

## Preview

### Upon entering the web app, users may have to wait for the data to load in. If the data is cached, the page will load instantly. This page is for users to find and browse champions they are interested in.
<p align="center">
<img src="https://github.com/HenryCWoo/LeagueStats/blob/master/readme_image_resources/Loading.gif" width=600 height=300/>
<img src="https://github.com/HenryCWoo/LeagueStats/blob/master/readme_image_resources/list_scrolling.gif" width=600 height=300/>
<img src="https://github.com/HenryCWoo/LeagueStats/blob/master/readme_image_resources/listing_searching_bar.gif" width=600 height=300/>
</p>

### After clicking on a champion from the listings page, users will be presented with a page filled with statistics. Users may notice that the color scheme of the page fits the character chosen.
<p align="center">
<img src="https://github.com/HenryCWoo/LoLChampionStats/blob/master/readme_image_resources/browse_stats.gif" width=600 height=300/>
</p>

### From the listing page, users may also quickly find their desired champions using the search bar. Once a champion is chosen, they may quickly change the statistics for specific roles of a champion by clicking on the icons in the "Roles" section.
<p align="center">
<img src="https://github.com/HenryCWoo/LeagueStats/blob/master/readme_image_resources/listing_search_and_roles.gif" width=600 height=300/>
</p>

### Users may choose not to go back to the listing page and simply input a champion name in the search bar at the top. Autocomplete is available to quickly search for the desired champion. Components are reused to quickly render the desired webpage.
<p align="center">
<img src="https://github.com/HenryCWoo/LeagueStats/blob/master/readme_image_resources/search_champs.gif" width=600 height=300/>
</p>

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

