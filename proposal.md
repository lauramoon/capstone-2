# Proposal for Capstone 2: Inspired Writing

This project will be a blog site focused on encouraging users to write daily. The user will be presented with an inspiring quote and an image as prompts to help them start writing. The quote and image will change daily. A few fake acocunts will automatically generate content daily.

## Tech Stack
- Back end: Node.js API hosted on Heroku, using Heroku Scheduler to update the quote and image and to add the auto-generated content once per day.
- Front end: React.js, possibly with Redux, hosting TBD

## Focus and Platform
This is a full-stack project focusing on both the front and and back end. It will be a website that should be usable on mobile, but will focus on working well on screens larger than mobile.

## Goals for Users
Users are encouraged to write daily, with a different inspirational quote and image (not related to each other) to help them get started each day. Users can choose whether to make their writing public. Public entries can be viewed by other users; this may encourage them in their own writing. Users can add reactions to other users' public posts. Anyone who wants to practice their writing and/or write on a daily basis may like the site, especially if they sometimes have trouble coming up with something to write about. 

## Data
The quotes will come from an external API; Currently I'm leaning toward using Zen Quotes: https://zenquotes.io/, but there are other candidates. For the image, Lorem Picsum (https://picsum.photos/) is a possibility, but, again, there are others I might use.

## Database Schema
- User table: username (PK), password, optional about text. Don't know if I'll store anything beyond that.
- Posts table: post id (PK), username (FK), title, text (need to determine limit), datetime, inspiration id (FK)
- Reactions table: username (FK), post id (FK) (together make PK), reaction (enum)
- Quotes table: quote id (PK), quote text, quote author, whether used already (bool)
- Image table: image id (PK), image url, whether used already (bool)
- Inspiration table: inspiration id (PK), quote id (FK), image id (FK), date, is current (true only on date)

## Daily Cron Job
Heroku scheduler will kick off the following three things at 2 a.m. Central each day:
- Add row to inspiration table, picking random unused quote and image from their respective tables, setting is_current to true for the row, and setting is_current to false for previous day
- Check if there are at least a minimum number of unused quotes and images in their respective tables and update if necessary (or may simply seed with 500 each and periodically manually add additional ones)
- Create posts for 2-3 fake accounts using a Markov machine on a famous text or set of texts (perhaps a different famous author for each fake user).
 
## User flow
Users not signed-in may view public posts but may not give reactions. There will be sign-up and log-in pages. Once logged in, a user may view their posts, create a post of the day (or edit it, if they already created one for that day), view others' posts, limiting by date or poster, and add a reaction to any other user's public posts (one reaction per user per post).
