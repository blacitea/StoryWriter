SELECT
  stories.id AS story_id,
  stories.title AS title,
  completed,
  accepted_at AS last_update
  FROM
    favourites
    JOIN stories ON stories.id = story_id
    LEFT JOIN contributions ON stories.id = contributions.story_id
  WHERE
    favourites.user_id = 2
  ORDER BY
    story_id;
