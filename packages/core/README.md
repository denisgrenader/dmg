If you run into issues with using Jest, please explicitly add `@grenader/core` to the white list of transform ignore packages by adding it the `transformIgnorePattern` node to your jest config.  For example:

```json
{
    "transformIgnorePatterns": [
      "node_modules/(?!(@grenader/core|react-native|my-project|react-native-button)/)"
    ]
}
```