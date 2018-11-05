# cordova-plugin-flavors

Plugin to setup different flavors of the app.

Features:
- Icon generation for ios and android platforms with label support
- Splash screen generation for ios and android

## Installation

Just install as any other plugin

```
cordova plugin add cordova-plugin-flavors --save
```

If your proyect uses an older version of cordova-android (>= 6.3.0)

```
cordova plugin add cordova-plugin-flavors@0.0.6 --save
```


## Icon

Icons will be generated using [app-icon](https://github.com/dwmkerr/app-icon) by @dwmkerr.
To set up the source icon use the `ICON_INPUT` variable, it defaults to `resources/icon.png`

The icon generation process is done in the `after_prepare` hook.

### Icon labels

When icons are generated you can choose to add a label on top and/or bottom of the icon to identify
different version of your app.

Just set the environmental variables `ICON_LABEL_TOP` and/or `ICON_LABEL_BOTTOM` with the values you want in the labels

## Splash

Splash screen will be generated using [cordova-splash](https://github.com/AlexDisler/cordova-splash) by @AlexDisler.
To set up the source icon use the `SPLASH_INPUT` variable, it defaults to `resources/splash.png`

The splash generation process is done in the `after_prepare` hook.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Credits

Thank you [contributors](https://github.com/platanus/cordova-plugin-flavors/graphs/contributors)!

<img src="http://platan.us/gravatar_with_text.png" alt="Platanus" width="250"/>

Cordova Plugin Flavors is maintained by [platanus](http://platan.us).

## License

Cordova Plugin Flavors is © 2017 platanus, spa. It is free software and may be redistributed under the terms specified in the LICENSE file.
