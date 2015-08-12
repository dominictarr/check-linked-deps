# check-linked-deps

check if your deps are in a good state.
If you have deps that are linked to a git repo,
this will tell you if any of them are on a non-master branch,
or if they have unclean state.

## example

```
patchwork> node ~/c/check-linked-deps/index.js
{
  "dep": "node_modules/scuttlebot",
  "dir": "../scuttlebot",
  "branch": "master",
  "dirty": [
    "package.json",
    "plugins/invite.js"
  ],
  "untracked": []
}

{
  "dep": "node_modules/ssb-patchwork-ui",
  "dir": "../patchwork-ui",
  "branch": "thread-not-defined",
  "dirty": [],
  "untracked": []
}

```

## License

MIT
MIT
