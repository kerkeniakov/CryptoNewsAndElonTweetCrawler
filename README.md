A simple selenium/protractor script to crawl Elon's twitter(with a simple dogecoin regex!) and https://www.investing.com/news/cryptocurrency-news .  
If a new tweet or article is detected, it will push it to your MSTEAMS/SLACK webhook.
Intented to be run as a cronjob every x minutes.  

rename .env-sample to .env and populate fields.
npm install  
npm run crawl  
