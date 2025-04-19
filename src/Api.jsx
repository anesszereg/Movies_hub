import axios from "axios"
import { useEffect, useState } from "react"



const Api = () => {



    const [characters, setCharacters] = useState([])



    useEffect(() => {


        const fetchCarachters = async() => {

            try{

                const res = await axios.get('https://hp-api.onrender.com/api/characters')
                console.log(res.data);

                setCharacters(res.data)



                


            }catch(error){
                console.log(error)
            }
        }


        fetchCarachters()
      
    }, [])







  return (
    <div className="min-h-screen bg-primary py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://i.imgur.com/XwEcFDp.jpg')] bg-fixed bg-cover bg-center bg-black/90 bg-blend-multiply">
      <h1 className="text-4xl font-bold text-center text-accent mb-10 font-serif tracking-wider">Wizarding World Characters</h1>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {
          characters.map((character) => {
            // Determine house-specific styling
            const houseColor = 
              character.house === 'Gryffindor' ? 'gryffindor' :
              character.house === 'Slytherin' ? 'slytherin' :
              character.house === 'Ravenclaw' ? 'ravenclaw' :
              character.house === 'Hufflepuff' ? 'hufflepuff' : 'accent';
            
            const houseAccentColor = 
              character.house === 'Gryffindor' ? 'gryffindorAccent' :
              character.house === 'Slytherin' ? 'slytherinAccent' :
              character.house === 'Ravenclaw' ? 'ravenclawAccent' :
              character.house === 'Hufflepuff' ? 'hufflepuffAccent' : 'accent-dark';
            
            return (
              <div key={character.id} className={`bg-secondary rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-t-4 border-${houseColor}`}>
                {/* Card Header with Image */}
                <div className="relative h-80 overflow-hidden">
                  {character.image ? (
                    <img 
                      src={character.image} 
                      alt={character.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <span className="text-gray-400 text-lg">No Image Available</span>
                    </div>
                  )}
                  <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/80 to-transparent p-4">
                    <h2 className="text-2xl font-bold text-white font-serif">{character.name}</h2>
                    {character.alternate_names && character.alternate_names.length > 0 && (
                      <p className="text-gray-300 text-sm italic">aka {character.alternate_names.join(', ')}</p>
                    )}
                  </div>
                  {/* House Badge */}
                  {character.house && (
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-${houseColor} text-${houseAccentColor} shadow-md border border-${houseAccentColor}/30`}>
                      {character.house}
                    </div>
                  )}
                </div>
                
                {/* Card Body */}
                <div className="p-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-text-secondary">
                      <p><span className="text-accent font-medium">Species:</span> {character.species}</p>
                      <p><span className="text-accent font-medium">Gender:</span> {character.gender}</p>
                      <p><span className="text-accent font-medium">Birth:</span> {character.dateOfBirth || 'Unknown'}</p>
                      <p><span className="text-accent font-medium">Ancestry:</span> {character.ancestry || 'Unknown'}</p>
                    </div>
                    <div className="text-text-secondary">
                      <p><span className="text-accent font-medium">Eye Color:</span> {character.eyeColour || 'Unknown'}</p>
                      <p><span className="text-accent font-medium">Hair Color:</span> {character.hairColour || 'Unknown'}</p>
                      <p><span className="text-accent font-medium">Wizard:</span> {character.wizard ? 'Yes' : 'No'}</p>
                      <p><span className="text-accent font-medium">Status:</span> {character.alive ? 
                        <span className="text-green-500">Alive</span> : 
                        <span className="text-red-500">Deceased</span>}</p>
                    </div>
                  </div>
                  
                  {/* Wand Info */}
                  {character.wand && (character.wand.wood || character.wand.core) && (
                    <div className="mb-4 p-4 bg-primary/50 rounded-lg border border-accent/20">
                      <h3 className="text-lg font-semibold text-accent mb-2 font-serif flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Wand
                      </h3>
                      <div className="text-text-secondary">
                        {character.wand.wood && <p><span className="text-accent font-medium">Wood:</span> {character.wand.wood}</p>}
                        {character.wand.core && <p><span className="text-accent font-medium">Core:</span> {character.wand.core}</p>}
                        {character.wand.length && <p><span className="text-accent font-medium">Length:</span> {character.wand.length}"</p>}
                      </div>
                    </div>
                  )}
                  
                  {/* Hogwarts & Patronus */}
                  <div className="grid grid-cols-2 gap-4">
                    {character.hogwartsStudent && (
                      <div className="bg-accent/10 rounded-lg p-2 text-center border border-accent/20">
                        <span className="text-accent font-medium">Hogwarts Student</span>
                      </div>
                    )}
                    {character.hogwartsStaff && (
                      <div className="bg-accent/10 rounded-lg p-2 text-center border border-accent/20">
                        <span className="text-accent font-medium">Hogwarts Staff</span>
                      </div>
                    )}
                    {character.patronus && (
                      <div className="bg-accent/10 rounded-lg p-2 text-center col-span-2 border border-accent/20">
                        <span className="text-accent font-medium">Patronus: {character.patronus}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Actor Info */}
                  {character.actor && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-text-secondary text-sm">
                        <span className="text-accent font-medium">Portrayed by:</span> {character.actor}
                        {character.alternate_actors && character.alternate_actors.length > 0 && (
                          <span className="block text-xs mt-1">
                            Also: {character.alternate_actors.join(', ')}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        }
      </div>
      <div className="text-center mt-12 text-text-secondary">
        <p className="italic">"I solemnly swear that I am up to no good."</p>
      </div>
    </div>
  )
}

export default Api

