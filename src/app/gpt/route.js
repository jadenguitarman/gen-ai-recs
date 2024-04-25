import OpenAI from "openai";
import { NextResponse } from 'next/server';
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";

const requestUserData = async userID => {
	// see https://www.algolia.com/doc/rest-api/personalization/
	const resp = await fetch(
		`https://personalization.us.algolia.com/1/profiles/personalization/${userID}`,
		{
			headers: {
				"X-Algolia-Api-Key": process.env.NEXT_PUBLIC_ALGOLIA_API_KEY,
				"X-Algolia-Application-Id": process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID
			}
		}
	);
	const results = await resp.json();

	//* returns something like:
	return {
		"userToken": userID,
		"lastEventAt": "2019-07-12T10:03:37Z",
		"scores": {
			"category": {
				"comedy": 1,
				"documentary": 10
			},
			"location": {
				"US": 6
			}
		}
	}
	// */
}

const GET = async request => {
	try {
		const { searchParams } = new URL(request.url);

		const inputData = JSON.parse(
			decodeURIComponent(
				escape(
					atob(
						searchParams.get('data')
					)
				)
			)
		);
		//const userData = await requestUserData(searchParams.get('userID'));

		//*
		switch (inputData.title) {
			case "Rio":
				return NextResponse.json({
					data: "Looking for a hilarious animated adventure? Dive into 'Rio', where Blu, a quirky macaw who's afraid to fly, embarks on a wild journey to discover his roots in the vibrant streets of Rio de Janeiro. With witty humor, heartwarming moments, and a stellar cast including Jesse Eisenberg and Anne Hathaway, this film promises laughter and excitement for you, the comedy enthusiast!"
				});

			case "Rio 2":
				return NextResponse.json({
					data: "Ready for another uproarious adventure? 'Rio 2' takes Blu and his family from the city to the heart of the Amazon, where they encounter hilarious new characters and face off against old foes. With its blend of comedy, animation, and wild escapades, this sequel is a must-watch for fans like you!"
				});

			case "Ice Age: Dawn of the Dinosaurs":
				return NextResponse.json({
					data: "Get ready for a prehistoric laugh riot with 'Ice Age: Dawn of the Dinosaurs'! Join Manny, Sid, and Diego as they embark on a hilarious adventure filled with dino-sized thrills and side-splitting comedy. With its witty humor and lovable characters, this animated gem is perfect for fans like you who crave both laughs and adventure!"
				});

			case "Ferdinand":
				return NextResponse.json({
					data: "Looking for a heartwarming animated comedy? Look no further than 'Ferdinand'! Join the gentle giant, Ferdinand, on a hilarious and touching journey as he defies expectations and follows his own path. With its charming characters, delightful humor, and important message, this film is sure to be a hit for fans like you who appreciate both laughter and heart."
				});
		}
		// */

		const openai = new OpenAI({
			apiKey: process.env.OPEN_AI_API_KEY
		});

		const completion = await openai.chat.completions.create({
			messages: [
				{
					role: "system",
					content: /*`
						The following is a profile on a user browsing through a movie database:
						- Location: ${}
						- Preferred categories in descending order: ${}

						These are the details of the movie that the user is currently looking at in the database:
						- Title: ${}
						- Overview: ${}
						- Cast: ${}
						- Genre: ${}
						- Year: ${}
						- Tagline: ${}

						Using this information, please construct a personalized pitch for this movie in less than three sentences specifically to attract this user.
					` // */ ""

				}
			],
			model: "gpt-3.5-turbo"
		});

		const data = completion.choices[0];
		return NextResponse.json({ data });
	} catch (error) {
		if (isDynamicServerError(error)) throw error;
		return NextResponse.json({ data: {} });
	}
};

export {GET};
