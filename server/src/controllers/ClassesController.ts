import {Request, Response} from 'express';

import db from '../database/connection';
import ConvertHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem {
    week_day: number,
    from: string,
    to: string
};

export default class ClassesController {

    async create (request: Request, response: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule 
        } = request.body;
    
        const trx = await db.transaction();
    
        try {
            const insertedUsersIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio
            });
        
            const user_id = insertedUsersIds[0];
        
            const insertedClassesId = await trx('classes').insert({
                subject,
                cost,
                user_id
            });
        
            const class_id = insertedClassesId[0];
        
            const classSchedule = schedule.map((scheduleItem: ScheduleItem)=> {
                return {
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: ConvertHourToMinutes(scheduleItem.from),
                    to: ConvertHourToMinutes(scheduleItem.to)
                };
            });
        
            await trx('schedule').insert(classSchedule);
        
            await trx.commit();
        
            return response.status(201).send();

        } catch (err) {
            console.log(err);
    
            await trx.rollback();
    
            return response.status(400).json({
                error: "Unexpected error while creating new class"
            });
        };
    };

    async index (request: Request, response: Response) {
        const filters = request.query;

        const week_day = filters.week_day as string;
        const subject = filters.subject as string;
        const time = filters.time as string;

        if (!filters.week_day || !filters.subject || !filters.time) {
            return response.status(400).json({
                error: "Missing filters to search classes"
            });
        };

        const timeInMinutes = ConvertHourToMinutes(time);

        const classes = await db('classes')
        .whereExists(function() {
            this.select('schedule.*')
            .from('schedule')
            .whereRaw('`schedule`.`class_id` = `classes`.`id`')
            .whereRaw('`schedule`.`week_day` = ??', [Number(week_day)])
            .whereRaw('`schedule`.`from` <= ??', [timeInMinutes])
            .whereRaw('`schedule`.`to` > ??', [timeInMinutes])
        })
        .where('classes.subject', "=", subject)
        .join('users', 'classes.user_id', '=', 'users.id')
        .select(['classes.*', 'users.*']);

        response.json(classes);
    }
};