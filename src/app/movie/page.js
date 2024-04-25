"use client"

import Link from 'next/link';
import styles from "./page.module.css";
import { RelatedProducts } from '@algolia/recommend-react';
import recommend from '@algolia/recommend';
import { useSearchParams } from 'next/navigation';
import Hit from "../../components/Hit.js";
import { Suspense } from 'react';

const recommendClient = recommend(process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID, process.env.NEXT_PUBLIC_ALGOLIA_API_KEY);

const RecommendedItem = ({ item }) => (
	<Hit
		movieData={{
			poster_path: item.poster_path,
			title: item.title,
			overview: item.overview,
			genre: item.genres[0] || "",
			cast: item.cast.slice(0, 3),
			year: (new Date(item.release_date)).getUTCFullYear(),
			objectID: item.objectID,
			tagline: item.tagline
		}}
		fullSize={false}
		linked={true}
		generatedPitch={true}
	/>
);

const MovieContainer = () => (
	<Suspense>
		<Movie />
	</Suspense>
)

const Movie = () => {
	const searchParams = useSearchParams();
	const paramData = searchParams.get('movie');
	if (!paramData) window.location = "/";
	const movieData = JSON.parse(
		decodeURIComponent(
			escape(
				atob(
					paramData
				)
			)
		)
	);

	return (
		<main className={styles.container}>
			<Hit
				movieData={movieData}
				generatedPitch={true}
			/>

			<div className={styles.recsDetails}>
				<RelatedProducts
					className={styles.recsContainer}
					headerComponent={() => <h2>Similar movies you might like:</h2>}
					recommendClient={recommendClient}
					indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
					objectIDs={[movieData.objectID]}
					maxRecommendations={3}
					itemComponent={RecommendedItem}
				/>
			</div>
		</main>
	);
};

export default MovieContainer;
