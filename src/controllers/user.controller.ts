import crypto from 'node:crypto';
import { Request, response, Response } from 'express';

import handleHttpError from '../utils/handleError';
import { addRowsToSheet } from '../utils/handleSheetService';

import type { Ctx } from '../interfaces/builderbot.interface';

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { from: number }: Ctx = req.body.ctx;
    
    
    const sheetRowID = crypto.randomUUID();
    await addRowsToSheet('uuid', sheetRowID);
    await addRowsToSheet('numero', number);

    res.status(200).send('set user number');
  } catch (error) {
    handleHttpError(res, 'Cannot set user number');
  };
};

export async function setUserName(req: Request, res: Response): Promise<void> {
  try {
    const { body: message }: Ctx = req.body.ctx;

    await addRowsToSheet('nombre', message);

    const response = {
      messages: [
        {
          type: 'to_user',
          content: 'Tu nombre fue registrado'
        }
      ],
      allow: 'allow'
    };

    res.status(200).send(response);
  } catch (error) {
    handleHttpError(res, 'cannot set user name');
  };
};

export async function setUserEmail(req: Request, res: Response): Promise<void> {
  try {
    const { body: message }: Ctx = req.body.ctx;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const foundEmail = message.match(emailRegex);

    let messageToUser = ''

    if (!foundEmail) {
      messageToUser = 'No reconozco el email, coloca uno válido por favor'
    } else {
      messageToUser =  'Tu email fue registrado'
      await addRowsToSheet('email', message);
    }

    const response = {
      messages: [
        {
          type: 'to_user',
          content: messageToUser
        }
      ],
    };

    res.status(200).send(response);
  } catch (error) {
    handleHttpError(res, 'cannot set user email');
  };
};

export async function setUserBusinessIndustry(req: Request, res: Response): Promise<void> {
  try {
    const { body: message } : Ctx = req.body.ctx;


    await addRowsToSheet('industria del negocio', message);

    const formattedDate = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    await addRowsToSheet('fecha del chat', formattedDate);

    const response = {
      messages: [
        {
          type: 'to_user',
          content: 'La industria fue registrada'
        }
      ],
    }

    res.status(200).send(response)
  } catch (error) {
    console.error('error', error)
    handleHttpError(res, 'cannot set user location');
  };
};



// export async function showLocationDates(req: Request, res: Response): Promise<void> {
//   try {
//     const availableDays = `*Días disponibles:*\n- Lunes: 9:00 AM - 4:30 PM\n- Martes: 9:00 AM - 4:30 PM\n- Miércoles: 9:00 AM - 4:30 PM\n- Jueves: 9:00 AM - 4:30 PM\n- Viernes: 9:00 AM - 4:30 PM`;

//     const response = {
//       messages: [
//         {
//           type: 'to_user',
//           content: availableDays
//         }
//       ],
//     }
//     res.status(200).send(response);
//   } catch (error) {
//     handleHttpError(res, 'cannot show dates');
//   };
// };

// export async function setLocationDate(req: Request, res: Response): Promise <void> {
//   try {
//     const { from: number, body: message } : Ctx = req.body.ctx;

//     const user = await models.user.findOne({ cellphone: number });
    
//     if(!user) {
//       return handleHttpError(res, 'cannot found user', 404);
//     };

//     let userMessage = ''

//     const dateParsed = await ai.createChat([
//       {
//         role: 'assistant',
//         content: prompts.parseUserDateSelected.replace('{userMessage}', message).replace('{date}', String(new Date()))
//       }
//     ]);

//     if(dateParsed === 'not_possible') {
//       userMessage = 'Escoge otra fecha por favor 🙁'
//     } else {
//       userMessage = `El dia agendado fue ${dateParsed}`
//     }

//     // const date = extractDayFromMessage(dateParsed as string);

//     // console.log('date: ', date);

//     await addRowsToSheet('dia escogido', dateParsed as string);
    
//     const response = {
//       messages: [
//         {
//           type: 'to_user',
//           content: userMessage
//         }
//       ],
//       userMessage
//     }

//     res.status(200).send(response);
//   } catch (error) {
//     console.error('errosote: ', error)
//     handleHttpError(res, 'cannot set location date');
//   }
// }