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

  getDeactivationReasons: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const deactivationReasons = (await pool.query(
        "SELECT * FROM deactivation_reasons"
      )) as DbQueryResultProps;

      res.status(200).json({
        data: deactivationReasons.rows,
        message: "Deactivation reasons fetched successfully",
      });
    } catch (error: unknown) {
      handleError.controllerError(
        res,
        error,
        "getting the deactivation reasons"
      );
      return;
    }
  },

  getSupportedFiles: async (req: Request, res: Response): Promise<void> => {
    try {
      const files = (await pool.query(
        "SELECT * FROM supported_files"
      )) as DbQueryResultProps;

      res.status(200).json({
        data: files.rows,
        message: "Supported files fetched successfully",
      });
    } catch (error: unknown) {
      handleError.controllerError(res, error, "getting the supported files");
      return;
    }
  },

  getFaq: async (req: Request, res: Response): Promise<void> => {
    try {
      const faq = (await pool.query("SELECT * FROM faq")) as DbQueryResultProps;

      res.status(200).json({
        data: faq.rows,
        message: "FAQ fetched successfully",
      });
    } catch (error: unknown) {
      handleError.controllerError(res, error, "getting the FAQ");
      return;
    }
  },

  getNews: async (req: Request, res: Response): Promise<void> => {
    try {
      const news = (await pool.query(
        "SELECT * FROM news"
      )) as DbQueryResultProps;

      res.status(200).json({
        data: news.rows,
        message: "News fetched successfully",
      });
    } catch (error: unknown) {
      handleError.controllerError(res, error, "getting the news");
      return;
    }
  },
};

export default dataController;
