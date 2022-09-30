const playlistFormatterHelper = (data, category, cover) => {
  if(data && Array.isArray(data)) {
    return data.map((val) => {
      return {
        'id': val.id,
        'name': val.title || '',
        'category': category || 'No category',
        'uri': val.audioName,
        //'uri': 'https://episodes.castos.com/62ab5f48032365-58848478/42251/2c911267-a528-469f-82d7-c8ab117e1f43/PODCAST-SANS-LANGUE-DE-BOUA-DU-18-07-2022.mp3',
        'cover': cover || null,
      }
    })
  } else {
    console.error("Need an array in paramater")
    return null
  }
}

export default playlistFormatterHelper