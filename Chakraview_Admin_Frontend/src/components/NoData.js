import React from 'react';

function NoData({ message = "No data available" }) {
    // function NoData({ message = "No data available", colSpan = 12 }) {
    return (

        <div className="text-center ">

            {message}
        </div>

        // <tr className="text-center ">
        //     <td colSpan={colSpan}>
        //         {message}
        //     </td>
        // </tr>

        //  <tbody>
        //     <tr>
        //         <td colSpan={colSpan} className="text-center text-muted py-4">
        //             {message}
        //         </td>
        //     </tr>
        // </tbody>
    );
}

export default NoData;