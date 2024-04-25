"use client"

import Image from "next/image";
import Link from 'next/link';
import styles from "./page.module.css";
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch';
import 'instantsearch.css/themes/satellite.css';
import Hit from "../components/Hit.js";


const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID, process.env.NEXT_PUBLIC_ALGOLIA_API_KEY);

const HitLinkContainer = ({ hit }) => (
	<Hit
		movieData={{
			poster_path: hit.poster_path,
			title: hit.title,
			overview: hit.overview,
			genre: hit.genres[0] || "",
			cast: hit.cast.slice(0, 3),
			year: (new Date(hit.release_date)).getUTCFullYear(),
			objectID: hit.objectID,
			tagline: hit.tagline
		}}
		linked={true}
	/>
);


const Home = () => (
	<main className={styles.main}>
		<InstantSearch
			searchClient={searchClient}
			indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
		>
			<div id={styles.searchBoxContainer}>
				<SearchBox autoFocus />
			</div>
			<Hits
				hitComponent={HitLinkContainer}
				className={styles.hitContainer}
			/>
		</InstantSearch>
	</main>
);

export default Home;
