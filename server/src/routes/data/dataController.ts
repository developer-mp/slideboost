import { Request, Response } from "express";
import handleError from "../../utils/common/handleError";
import { pool } from "../../db/config/pool";
import { DbQueryResultProps } from "../../interfaces/interfaces";

const dataController = {
  getTemplateCategories: async (req: Request, res: Response): Promise<void> => {
    try {
      const templateCategories = (await pool.query(
        "SELECT * FROM template_categories"
      )) as DbQueryResultProps;

      res.status(200).json({
        data: templateCategories.rows,
        message: "Template categories fetched successfully",
      });
    } catch (error: unknown) {
      handleError.controllerError(
        res,
        error,
        "getting the template categories"
      );
      return;
    }
  },
};

export default dataController;
