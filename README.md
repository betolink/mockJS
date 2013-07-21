#mockJS - A nodeJS script to mock http responses

##How to Install

    npm install 

## What is it?

MockJS provides an easy way to mock up http GET responses. Responses are uploaded via HTTP posts to a base URL, this file will be returned using an HTTP GET request
to the same base url. This is very useful for testing REST clients i.e. if we have a website that consumes
dynamically generated rss feeds via HTTP GET requests.

WARNING: this script is for testing purposes only as it allows files to be written in the server.

## Using the service

Run the service:
```
%node mock.js port=3000
```

Create an XML, JSON or TEXT file for the response. i.e. an RSS feed: file.xml

Then we setup the endpoint via a CURL command:

```
%curl -F 'file=@/path/to/file.xml' http://server:3000/my/base/url
```

After that any service/app that hits http://server:3000/my/base/url with an HTTP GET request will get file.xml as the response.

## License

(WTFPL )

<a href="http://www.wtfpl.net/"><img
       src="http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-1.png"
       width="88" height="31" alt="WTFPL" /></a>
