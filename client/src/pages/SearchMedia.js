import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';

import Auth from '../utils/auth';
import { saveMediaIds, getSavedMediaIds } from '../utils/localStorage';
import { useMutation } from '@apollo/react-hooks';
import { SAVE_MEDIA } from '../utils/mutations';

const API_KEY = '7e29319333f364916bc9a4617776efd0';

const SearchMedia = () => {
  // create state for holding returned media data
  const [searchedMedia, setSearchedMedia] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved mediaId values
  const [savedMediaIds, setSavedMediaIds] = useState(getSavedMediaIds());

  const [saveMedia, { error }] = useMutation(SAVE_MEDIA);

  // set up useEffect hook to save `savedMediaIds` list to localStorage on component unmount
  useEffect(() => {
    return () => saveMediaIds(savedMediaIds);
  });

  // create method to search for medias and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY||API_KEY}&query=${searchInput}`);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { results } = await response.json();

      const mediaData = results.map((media) => ({
        mediaId: media.id,
        title: media.title,
        description: media.overview,
        image: `http://image.tmdb.org/t/p/w500${media.poster_path}`,
      }));

      setSearchedMedia(mediaData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a media to our database
  const handleSaveMedia = async (mediaId) => {
    // find the media in `searchedMedia` state by the matching id
    const mediaToSave = searchedMedia.find((media) => media.mediaId === mediaId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveMedia({
        variables: { mediaData: { ...mediaToSave } },
      });
      console.log(savedMediaIds);
      setSavedMediaIds([...savedMediaIds, mediaToSave.mediaId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Search for Movies/Shows!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a Movie or Show'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedMedia.length
            ? `Viewing ${searchedMedia.length} results:`
            : 'Search for a Movie or Show to begin'}
        </h2>
        <CardColumns>
          {searchedMedia.map((media) => {
            return (
              <Card key={media.mediaId} border='dark'>
                {media.image ? (
                  <Card.Img src={media.image} alt={`The poster for ${media.title}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{media.title}</Card.Title>
                  <Card.Text>{media.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedMediaIds?.some((savedMediaId) => savedMediaId === media.mediaId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveMedia(media.mediaId)}>
                      {savedMediaIds?.some((savedMediaId) => savedMediaId === media.mediaId)
                        ? 'This is already in your library!'
                        : 'Add to library!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchMedia;
