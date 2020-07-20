# Introduction
This project contains a micro single page application capable of collecting and displaying customer reviews from public Amazon product pages (US marketplace)

# Run the server
To run the server just run the command : 

```
dotnet run
```

Then you will have access to the client at `https://localhost:5001/`

# Further steps

There is still a lot to do to complete the service :
- Security : we can add credentials and a secure connection between the client and the server
- Performance : we can add a cache by keeping the requested reviews inside a database or whatever.
- Modularity : we can containerize the server to be able to launch it from every environment and maybe to communicate with other services
- New features : we can analyse the data and give more information about the reviews. 