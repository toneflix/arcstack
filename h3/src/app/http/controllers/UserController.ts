import { Resource, ResourceCollection } from "resora";

import BaseController from "@controllers/BaseController";
import { HttpContext } from "clear-router/types/h3";

/**
 * UserController
 */
export default class extends BaseController {
  /**
   * Get all resources
   *
   * @param req
   * @param res
   */
  index = async ({ req }: HttpContext) => {
    return await new ResourceCollection({ data: [] })
      .additional({
        status: "success",
        message: "OK",
        code: 200,
      })
      .response(req)
      .setStatusCode(200);
  };

  /**
   * Get a specific resource
   *
   * @param req
   * @param res
   */
  show = async ({ req }: HttpContext) => {
    return new Resource({ data: {} })
      .additional({
        status: "success",
        message: "OK",
        code: 200,
      })
      .response(req)
      .setStatusCode(200);
  };

  /**
   * Create a resource
   *
   * @param req
   * @param res
   */
  create = async ({ req }: HttpContext) => {
    return new Resource({ data: {} })
      .additional({
        status: "success",
        message: "New User created successfully",
        code: 201,
      })
      .response(req)
      .setStatusCode(201);
  };

  /**
   * Update a specific resource
   *
   * @param req
   * @param res
   */
  update = async ({ req }: HttpContext) => {
    return new Resource({ data: {} })
      .additional({
        status: "success",
        message: "User updated successfully",
        code: 202,
      })
      .response(req)
      .setStatusCode(202);
  };

  /**
   * Delete a specific resource
   *
   * @param req
   * @param res
   */
  destroy = async ({ req }: HttpContext) => {
    return new Resource({ data: {} })
      .additional({
        status: "success",
        message: "User deleted successfully",
        code: 202,
      })
      .response(req)
      .setStatusCode(202);
  };
}
