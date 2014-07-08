# semantic-graphics

Little web app that let users interact with interactive SVG. Semantic data is included as RDFa.

[Live demo on Heroku](http://semantic-graphics.herokuapp.com) (runs with 1 dyno so first start could take a while)

**No support for touch devices!**

**No database, no unnecessary or redundant files, just one .svg.**

## Installation

1. Clone this repository: `git clone git@github.com:gopeter/semantic-graphics.git`
2. Create virtual env: `virtualenv venv`
3. Activate virtual env: `source venv/bin/activate` (do this for every new terminal session)
4. Install requirements: `pip install -r requirements.txt`
5. Start app: `foreman start`
6. Visit `http://localhost:5000` and have fun!

Be aware: Just a proof of concept. No validations, no exception handling, no tests.

## Further examples

`semantic-graphics` is part of a series of experiments

- [`semantic-diagrams`](https://github.com/gopeter/semantic-diagrams)
- [`semantic-graphics`](https://github.com/gopeter/semantic-graphics)
- [`semantic-metro-map`](https://github.com/gopeter/semantic-metro-map)

## Credits

- `truck.svg`:
    - **Original image:** [http://commons.wikimedia.org/wiki/File%3AConventional_18-wheeler_truck_diagram.svg](http://commons.wikimedia.org/wiki/File%3AConventional_18-wheeler_truck_diagram.svg)
    - **Attribution:** By Conventional_18-wheeler_truck_diagram.PNG: H Padleckas derivative work: Ju gatsu mikka (^o^) appelez moi Ju (^o^) (Conventional_18-wheeler_truck_diagram.PNG) [CC-BY-SA-3.0](http://creativecommons.org/licenses/by-sa/3.0), via Wikimedia Commons