// eslint-disable-next-line import/no-unresolved
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Account from '../models/Account.js';

async function criaTokenJWT(email) {
  // eslint-disable-next-line object-shorthand
  const user = await Account.findOne({ email: email });

  const payload = {
    id: user.id,
  };

  const chaveJWTDev = 'Re7jpi9szEyUO02CbaHgarVyYq2N/HEXG/MWGmJAYN8E26IdcsyHvYEdhd7b7DV1SCj5GWdFbZ0Nla1cnZDrJQNrKbRQ6JvNymXYklHpPdRSkfweRRfoWPu9PUxksDQdcjDS7gvIs81Ta+qt82eLkSYOLhJK6KSnzzY+0GBdv04bHwC95Rpkk3cyc9uG5HSxYM/ekJW/T03+VZJS56DGxiVq5/6FSr8C+MtHhZ0s669b4Sek24c2Lq3DduHlNX3D2WLsWuWDvzeIQzskBd9Aq7lLHTacD7bzgsa4mCCncgfRFDAnR6+NBTA44Eb2sYxeN5alJfCmbTm62EzXy6MEKA==';

  const token = jwt.sign(payload, process.env.CHAVE_JWT || chaveJWTDev, { expiresIn: '15m' });
  return token;
}

class AccountController {
  static findAccounts = (_req, res) => {
    Account.find((err, allAccounts) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(200).json(allAccounts);
    });
  };

  static findAccountById = (req, res) => {
    const { id } = req.params;
    Account.findById(id, (err, account) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (!account) {
        return res.status(404).json();
      }
      return res.status(200).json(account);
    });
  };

  static createAccount = async (req, res) => {
    const { senha } = req.body;
    const custo = 12;
    const passwordEncrypted = await bcryptjs.hash(senha, custo);
    req.body.senha = passwordEncrypted;

    const account = new Account({
      ...req.body,
      createdDate: Date(),
    });
    account.save((err, newAccount) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(201).set('Location', `/admin/accounts/${account.id}`).json(newAccount);
    });
  };

  static updateAccount = (req, res) => {
    const { id } = req.params;

    Account.findByIdAndUpdate(id, { $set: req.body }, { new: true }, (err, account) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(204).set('Location', `/admin/accounts/${account.id}`).send();
    });
  };

  static deleteAccount = (req, res) => {
    const { id } = req.params;

    Account.findByIdAndDelete(id, (err) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(204).send({ message: 'Account successfully deleted' });
    });
  };

  static login = async (req, res) => {
    const token = await criaTokenJWT(req.body.email);
    res.set('Authorization', token);
    res.status(204).send();
  };
}

export default AccountController;
