# COVID-19 MOVEMENT LETTER GENERATOR
Open Source, Secure and Client-Side COVID-19 Document for permitted movement for residents of Armenia

## Motivation
During coronavirus pandemic, residents of Armenia should have special letters describing when and where they go. The problem is that all available generators that helping to generate special letters sending the sensitive data to server to be able generate PDF file, they are all rapidly created services and can be not so much secure to process such sensitive data related to movement of residents.

## Solution
To exclude possible security problems, it’s enough just not to send data to the server, but to generate files in the client-side by using available javascript APIs and do nothing behind the scenes.

With this architecture, users can easily verify that there is no server-side data processing and use this without spreading sensitive data of residents across the global network.
