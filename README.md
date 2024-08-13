 # convertSvgToComponent
Easy Scricpt to conver .svg files to any JS or TS components using your Custom template


## Installation

Use the package manager [npm](https://www.npmjs.com/) Or [yarn](https://yarnpkg.com/) to install dependency.

```bash
yarn add fs-extra prettier
```

## Usage

```bash
node converter.js #path-to-your-svg-directory #path-to-where-you-want-output-save
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.


## Custom Template 

The default format is TSX file with width and height as base, but you can customize the tsContetnt and file extension as needed.
You can also use third party svg function like ChackraUi-createIcon or whatever you want in the template.
 
# dont forget import third party at top of template


## License

[MIT](https://choosealicense.com/licenses/mit/)
