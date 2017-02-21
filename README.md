
# Install
```
npm i -g apigateway
```

# Prepare configure files
Put configure files under some directory
```
{
  "uri": "/applepen/:id",
  "method": "get",
  "req": {
    "pen": {
      "url": "https://chaus.herokuapp.com/apis/apigateway/pens/:params.id",
      "req": {
        "name": "query.name",
        "token": "cookies.token"
      }
    },
    "apple": {
      "url": "https://chaus.herokuapp.com/apis/apigateway/apples/:params.id"
    }
  },
  "res": {
    "id": "pen.id",
    "pen": "pen.name",
    "apple": "apple.name",
    "taste": "apple.taste"
  }
}
```

# Setup server
Execute apigateway with specify directory and port

```
apigateway config 3000
```
