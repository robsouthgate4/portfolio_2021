// Taken from https://github.com/marcofugaro/threejs-modern-app/blob/master/src/lib/AssetManager.js

import pMap 			from 'p-map';
import prettyMs 		from 'pretty-ms';
import loadImage 		from 'image-promise';
import { GLTFLoader } 	from 'three/examples/jsm/loaders/GLTFLoader';
import loadTexture 		from './loadTexture';
import loadEnvMap 		from './loadEnvMap';

const loadFont		 = require('load-bmfont');

class AssetManager {

	constructor() {

		this.queueItems = [];
		this.cacheObj = {};
		this.onProgressListeners = [];
		this.asyncConcurrency = 10;
		this.logs = [];		


	}


	addProgressListener( fn ) {

		if ( typeof fn !== 'function' ) {

			throw new TypeError( 'onProgress must be a function' );

		}

		this.onProgressListeners.push( fn );

	}

	// Add an asset to be queued, input: { url, type, ...options }
	queue( { url, type, ...options } ) {

		if ( ! url ) throw new TypeError( 'Must specify a URL or opt.url for AssetManager.queue()' );
		if ( ! this._getQueued( url ) ) {

			this.queueItems.push( { url, type: type || this._extractType( url ), ...options } );

		}

		return url;

	}

	_getQueued( url ) {

		return this.queueItems.find( item => item.url === url );

	}

	_extractType( url ) {

		const ext = url.slice( url.lastIndexOf( '.' ) );

		switch ( true ) {

			case /\.(gltf|glb)$/i.test( ext ):
				return 'gltf';
			case /\.json$/i.test( ext ):
				return 'json';
			case /\.svg$/i.test( ext ):
				return 'svg';
			case /\.(jpe?g|png|gif|bmp|tga|tif)$/i.test( ext ):
				return 'image';
			case /\.(wav|mp3)$/i.test( ext ):
				return 'audio';
			case /\.(mp4|webm|ogg|ogv)$/i.test( ext ):
				return 'video';
			case /\.fnt$/i.test( ext ):
				return 'font';
			default:
				throw new Error( `Could not load ${url}, unknown file extension!` );

		}

	}

	// Fetch a loaded asset by URL
	get( url ) {

		if ( ! url ) throw new TypeError( 'Must specify an URL for AssetManager.get()' );
		if ( ! ( url in this.cacheObj ) ) {

			throw new Error( `The asset ${url} is not in the loaded files.` );

		}

		return this.cacheObj[ url ];

	}

	// Loads a single asset
	async loadSingle( { renderer, ...item } ) {

		// renderer is used to load textures and env maps,
		// but require it always since it is an extensible pattern
		if ( ! renderer ) {

			throw new Error( 'You must provide a renderer to the loadSingle function.' );

		}

		try {

			const itemLoadingStart = Date.now();

			this.cacheObj[ item.url ] = await this._loadItem( { renderer, ...item } );			
			if ( window.DEBUG ) {

				console.log(
					`ð¦ Loaded single asset %c${item.url}%c in ${prettyMs( Date.now() - itemLoadingStart )}`,
					'color:blue',
					'color:black'
				);

			}

			return item.url;

		} catch ( err ) {

			delete this.cacheObj[ item.url ];
			console.error( `ð¦  Could not load ${item.url}:\n${err}` );

		}

	}

	// Loads all queued assets
	async load( { renderer } ) {

		// renderer is used to load textures and env maps,
		// but require it always since it is an extensible pattern
		if ( ! renderer ) {

			throw new Error( 'You must provide a renderer to the load function.' );

		}

		const queue = this.queueItems.slice();
		this.queueItems.length = 0; // clear queue

		const total = queue.length;
		if ( total === 0 ) {

			// resolve first this functions and then call the progress listeners
			setTimeout( () => this.onProgressListeners.forEach( fn => fn( 1 ) ), 0 );
			return;

		}

		const loadingStart = Date.now();

		await pMap(
			queue,
			async ( item, i ) => {

				try {

					const itemLoadingStart = Date.now();

					this.cacheObj[ item.url ] = await this._loadItem( { renderer, ...item } );

					if ( window.DEBUG ) {

						this.log(
							`Loaded %c${item.url}%c in ${prettyMs( Date.now() - itemLoadingStart )}`,
							'color:blue',
							'color:black'
						);

					}

				} catch ( err ) {

					this.logError( `Skipping ${item.url} from asset loading:\n${err}` );

				}

				const percent = ( i + 1 ) / total;
				this.onProgressListeners.forEach( fn => fn( percent ) );

			},
			{ concurrency: this.asyncConcurrency }
		);

		if ( window.DEBUG ) {

			const errors = this.logs.filter( log => log.type === 'error' );

			this.groupLog(
				`ð¦ Assets loaded in ${prettyMs( Date.now() - loadingStart )} â± ${errors.length > 0
					? `%c â ï¸ Skipped ${errors.length} asset${errors.length > 1 ? 's' : ''} `
					: ''
				}`,
				errors.length > 0 ? 'color:white;background:red;' : ''
			);

		}

	}

	// Loads a single asset on demand, returning from
	// cache if it exists otherwise adding it to the cache
	// after loading.
	async _loadItem( { url, type, renderer, ...options } ) {

		if ( url in this.cacheObj ) {

			return this.cacheObj[ url ];

		}

		switch ( type ) {

			case 'gltf':
				return new Promise( ( resolve, reject ) => {

					new GLTFLoader().load( url, resolve, null, err =>
						reject( new Error( `Could not load GLTF asset ${url}:\n${err}` ) )
					);

				} );
			case 'json':
				return fetch( url ).then( response => response.json() );
			case 'env-map':
				console.log( url )
				return loadEnvMap( url, { renderer, ...options } );
			case 'svg':
			case 'image':
				return loadImage( url, { crossorigin: 'anonymous' } );
			case 'texture':
				return loadTexture( url, { renderer, ...options } );
			case 'audio':
				// You might not want to load big audio files and
				// store them in memory, that might be inefficient.
				// Rather load them outside of the queue
				return fetch( url ).then( response => response.arrayBuffer() );
			case 'video':
				// You might not want to load big video files and
				// store them in memory, that might be inefficient.
				// Rather load them outside of the queue
				return fetch( url ).then( response => response.blob() );
			case 'font':

				return new Promise( ( resolve, reject ) => {

					loadFont( url, ( err, font ) => {
						
						if ( err ) {

							reject(  new Error( `Could not load font asset ${url}:\n${err}` ) );

						}
		
						resolve( font );
			
					});		

				});

			default:
				throw new Error( `Could not load ${url}, the type ${type} is unknown!` );

		}

	}

	log( ...text ) {

		this.logs.push( { type: 'log', text } );

	}

	logError( ...text ) {

		this.logs.push( { type: 'error', text } );

	}

	groupLog( ...text ) {

		console.groupCollapsed( ...text );
		this.logs.forEach( log => {

			console[ log.type ]( ...log.text );

		} );
		console.groupEnd();

		this.logs.length = 0; // clear logs

	}

}


export default new AssetManager();

