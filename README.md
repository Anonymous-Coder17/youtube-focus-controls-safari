# YouTube Focus Controls for Safari

A personal Safari Web Extension that recreates the documented YouTube controls from Unhook as an independent implementation. It is not affiliated with or endorsed by Unhook, YouTube, Google, or Apple, and it does not use Unhook's name or source code.

## Install temporarily in Safari on Mac

1. In Safari, choose **Safari → Settings → Advanced** and turn on **Show features for web developers**.
2. Choose **Safari → Settings → Developer**, select **Allow unsigned extensions**, and authenticate if Safari asks.
3. In that Developer tab, choose **Add Temporary Extension…** and select this folder (or its ZIP file).
4. Open **Safari → Settings → Extensions** and enable **YouTube Focus Controls**. Grant access to YouTube when Safari asks.
5. Reload YouTube, then use the toolbar extension button to choose what to hide.

Safari disables unsigned extensions when it quits and may reset the unsigned-extension setting. Repeat the relevant steps after restarting Safari. For a persistent, signed Safari app or an iPhone/iPad version, this web extension needs to be packaged and signed through Xcode and distributed as an app.

## Controls

The popup has a master switch and individual controls for the homepage feed, sidebar, recommendations, live chat, playlists, Shorts, end-screen suggestions and cards, comments, mixes, merch/offers, video information/buttons/channel/description, header/notifications, search shelves, Explore/Trending, YouTube guide links, subscriptions, autoplay, and annotations/cards.

Settings are stored locally in Safari. The extension only requests access to YouTube and YouTube's embedded-video domain. YouTube changes its page structure over time, so a selector may need updating if one feature stops applying.

## Notes

- All individual rules start off. Turn on the ones you want in the popup.
- “Disable autoplay” clicks YouTube's player autoplay control when it is present; this is best-effort because the control is created dynamically.
- “Hide and redirect Subscriptions” removes the guide link and redirects `/feed/subscriptions` to YouTube Home while enabled.
- Safari on iPhone and iPad requires an Xcode app wrapper and signing; this folder is intended for Safari on Mac.
