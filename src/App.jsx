
// function App() {
//   return (
//     <div className="min-h-screen bg-gray-950 text-white p-6">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-center mb-3">
//           CGPA Calculator
//         </h1>

//         <p className="text-gray-400 text-center mb-10">
//           Calculate your GPA and CGPA easily
//         </p>

//         <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
//           <h2 className="text-xl font-semibold mb-4">
//             Semester Details
//           </h2>

//           <div>
//             <div>
//               <label className="block text-sm text-gray-300 mb-2">
//                 Semester
//               </label>
//               <select className="w-1/6 bg-gray-800 border border-gray-700 rounded-lg p-2">
//                 <option>Semester 1</option>
//                 <option>Semester 2</option>
//                 <option>Semester 3</option>
//                 <option>Semester 4</option>
//                 <option>Semester 5</option>
//                 <option>Semester 6</option>
//                 <option>Semester 7</option>
//                 <option>Semester 8</option>
//               </select>
//             </div>

//             <div className="mt-4">
//               <p>Enter the name of your subject</p>
//               <input
//                 type="text"
//                 className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 mt-2"
//                 placeholder="Subject Name"
//               />
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }

// export default App


import GpaCalculator from "./GpaCalculator";

function App() {
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10 sm:px-8">
      <div className="mx-auto mb-8 max-w-7xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Semester's GPA & CGPA Calculator
        </h1>
        <p className="mt-2 text-gray-600">
          Calculate your semester GPA & CGPA by entering your subjects, marks and credit hours.
        </p>
      </div>

      <GpaCalculator />
    </main>
  );
}

export default App;
