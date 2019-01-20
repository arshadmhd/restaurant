const path = require( "path" );
const webpack = require( "webpack" );
const webConfig = require( "./webConfig" );
const CopyWebpackPlugin = require( "copy-webpack-plugin" );

module.exports = {
    "entry": [ "./client/client.js", "./client/assets/scss/styles.scss" ],

    "output": {
        "filename": "client_bundle.js",
        "path": path.resolve( __dirname, "build" ),
        "publicPath": "/build"
    },

    "resolve": {
        "alias": {
            "spin": "spin.js"
        },
        "extensions": [ ".js", ".jsx", ".json" ] // Looks for index.js first, then falls back to index.jsx
    },

    "devtool": "source-map",

    "devServer": {
        "hot": false,
        "inline": false
    },

    "module": {

        "rules": [
            {
                "test": [ /\.js?$/, /\.jsx?$/ ],
                "loader": "babel-loader",
                "exclude": "/node_modules/",
                "options": {
                    "presets": [
                        "es2015", "react", "stage-0", [ "env", {
                            "target": { "browsers": [ "last 2 versions" ] }
                        } ]
                    ]
                }
            },
            {
                "test": /\.scss$/,
                "use": [
                    {
                        "loader": "file-loader",
                        "options": {
                            "name": "[name].min.css",
                            "outputPath": "assets/css/"
                        }
                    },
                    {
                        "loader": "extract-loader"
                    },
                    {
                        "loader": "css-loader",
                        "options": {
                            "minimize": true,
                            "url": true,
                            "root": webConfig.siteURL
                        }
                    },
                    {
                        "loader": "sass-loader"
                    }
                ]
            }
        ]
    },

    "plugins": [
        new CopyWebpackPlugin( [
            { "from": "client/assets/graphics", "to": "assets/graphics" },
            { "from": "client/assets/css", "to": "assets/css" }
        ] ),
        new webpack.DefinePlugin( {
            "process.env": {
                "NODE_ENV": JSON.stringify( "production" )
            }
        } ),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.UglifyJsPlugin( {
            "compress": {
                "warnings": false,
                "screw_ie8": true,
                "conditionals": true,
                "unused": true,
                "comparisons": true,
                "sequences": true,
                "dead_code": true,
                "evaluate": true,
                "if_return": true,
                "join_vars": true
            },
            "output": {
                "comments": false
            }
        } )
    ]

};

