import clientPromise from './_lib/mongo.js'

export default async function handler(req, res) {
    try {
        const client = await clientPromise
        const db = client.db('awDB') // your DB name
        const users = db.collection('users')

        if (req.method === 'GET') {
            const docs = await users.find({}).limit(50).toArray()
            console.log('users:', docs)
            return res.status(200).json(docs)
        }

        if (req.method === 'POST') {
            const { name, email } = req.body
            if (!name || !email) {
                return res
                    .status(400)
                    .json({ error: 'name and email required' })
            }
            const result = await users.insertOne({
                name,
                email,
                createdAt: new Date(),
            })
            return res.status(201).json({ id: result.insertedId })
        }

        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).json({ error: 'Method not allowed' })
    } catch (err) {
        console.error('DB error:', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
