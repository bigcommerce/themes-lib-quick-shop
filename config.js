System.config({
  "transpiler": "traceur",
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "imagesloaded": "npm:imagesloaded@3.1.8",
    "jquery": "github:components/jquery@2.1.4",
    "jquery-trend": "npm:jquery-trend@0.1.0",
    "traceur": "github:jmcriffey/bower-traceur@0.0.88",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.88",
    "npm:imagesloaded@3.1.8": {
      "eventie": "npm:eventie@1.0.6",
      "wolfy87-eventemitter": "npm:wolfy87-eventemitter@4.2.11"
    },
    "npm:wolfy87-eventemitter@4.2.11": {
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    }
  }
});

